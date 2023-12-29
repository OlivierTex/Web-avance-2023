--
-- Ce fichier contient les tables (sans valeurs), triggers, fonctions et policies RLS du projet.
-- Pour récupérer ces informations nous avons utilisé d'une part les tables et contraintes depuis notre projet sur le site de supabase, et d'autre part en faisant un backup de la bdd avec pg_dump.
-- 

--- Tables ---

create table
  public.user (
    id uuid not null,
    email text not null,
    username text null,
    type_compte character varying null default 'user'::character varying,
    bio text null default ''::text,
    language text null default ''::text,
    "darkMode" boolean not null default false,
    constraint users_pkey primary key (id),
    constraint user_username_key unique (username),
    constraint users_email_key unique (email),
    constraint user_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;

create table
  public.album (
    id uuid not null default gen_random_uuid (),
    name_liste text null,
    description_liste text null,
    username text null,
    id_user uuid null,
    created_at timestamp without time zone null default now(),
    constraint listes_pkey primary key (id)
  ) tablespace pg_default;
  
  create table
  public.commentaire (
    id uuid not null default uuid_generate_v4 (),
    commentaire character varying(255) null,
    id_user uuid null,
    username text null,
    signaler boolean null,
    api_image_id character varying null,
    url_image character varying null,
    email text null,
    constraint commentaire_pkey primary key (id),
    constraint commentaire_email_fkey foreign key (email) references "user" (email) on update cascade on delete cascade,
    constraint commentaire_id_user_fkey foreign key (id_user) references "user" (id),
    constraint commentaire_username_fkey foreign key (username) references "user" (username) on update cascade on delete cascade
  ) tablespace pg_default;
  
  create table
  public.commentaire_admin (
    id uuid not null default gen_random_uuid (),
    commentaire text null,
    id_user uuid null,
    username character varying null,
    constraint commentaire_admin_pkey primary key (id)
  ) tablespace pg_default;
  
  create table
  public.favoris_album (
    id uuid not null default gen_random_uuid (),
    id_user uuid null,
    id_album character varying null,
    constraint favoris_album_pkey primary key (id)
  ) tablespace pg_default;
  
  create table
  public.favoris_image (
    id uuid not null default uuid_generate_v4 (),
    id_user uuid null,
    url_image text null,
    id_image character varying null,
    constraint favoris_pkey primary key (id),
    constraint favoris_image_id_user_fkey foreign key (id_user) references "user" (id) on delete cascade
  ) tablespace pg_default;
  
  create table
  public.favoris_video (
    id uuid not null default gen_random_uuid (),
    id_user uuid null,
    url_video text null,
    id_video character varying null,
    imagevideo character varying null,
    constraint favoris_video_pkey primary key (id)
  ) tablespace pg_default;
  
  create table
  public.images (
    id serial,
    api_image_id character varying(255) not null,
    views integer null default 0,
    url character varying null,
    constraint images_pkey primary key (id),
    constraint images_api_image_id_key unique (api_image_id),
    constraint unique_url unique (url)
  ) tablespace pg_default;
  
  create table
  public.link_image_album (
    id uuid not null default gen_random_uuid (),
    url text null,
    id_image character varying null,
    id_album uuid null,
    constraint link_image_album_pkey primary key (id),
    constraint link_image_album_id_album_fkey foreign key (id_album) references album (id)
  ) tablespace pg_default;
  
  create table
  public.link_video_album (
    id uuid not null default gen_random_uuid (),
    url text null,
    id_video character varying null,
    id_album uuid null,
    imagevideo character varying null,
    constraint link_video_album_pkey primary key (id)
  ) tablespace pg_default;
  
  
--- Fonctions ---

  CREATE FUNCTION public.admin_check() RETURNS boolean
    LANGUAGE sql SECURITY DEFINER
    AS $$

  SELECT EXISTS (

    SELECT type_compte

    FROM public.user

    WHERE (id = auth.uid()) AND (type_compte = 'admin')

  )

$$;


CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$

begin

  insert into public.user (id, email, username)

  values (new.id, new.email, new.email);

  return new;

end;

$$;


CREATE FUNCTION public.prevent_type_compte_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN

    -- Si l'utilisateur actuel est l'administrateur, autoriser la mise à jour

    IF current_user = 'postgres' OR (SELECT type_compte FROM public.user WHERE id = auth.uid()) = 'admin' THEN

        RETURN NEW;

    END IF;



    -- Vérifier si la colonne type_compte est mise à jour

    IF OLD.type_compte = 'user' AND NEW.type_compte <> OLD.type_compte THEN

        RAISE EXCEPTION 'La modification de la colonne type_compte est interdite pour le rôle %.', current_user;

    END IF;



    -- Si la condition n'est pas rencontrée, autoriser la mise à jour

    RETURN NEW;

END;

$$;


--- Triggers ---
  
  CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

  create trigger prevent_type_compte_update_trigger before
  update on "user" for each row
  execute function prevent_type_compte_update ();

  
--- RLS ---
  
--
-- Name: album; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.album ENABLE ROW LEVEL SECURITY;

--
-- Name: commentaire; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.commentaire ENABLE ROW LEVEL SECURITY;

--
-- Name: commentaire_admin; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.commentaire_admin ENABLE ROW LEVEL SECURITY;

--
-- Name: favoris_album; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.favoris_album ENABLE ROW LEVEL SECURITY;

--
-- Name: favoris_image; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.favoris_image ENABLE ROW LEVEL SECURITY;

--
-- Name: favoris_video; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.favoris_video ENABLE ROW LEVEL SECURITY;

--
-- Name: images; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

--
-- Name: link_image_album; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.link_image_album ENABLE ROW LEVEL SECURITY;

--
-- Name: link_video_album; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.link_video_album ENABLE ROW LEVEL SECURITY;

--
-- Name: user; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;


--- Policies ---

--
-- Name: user Admins are all powerfull and mighty; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins are all powerfull and mighty" ON public."user" USING (public.admin_check()) WITH CHECK (public.admin_check());


--
-- Name: commentaire Admins can delete posts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can delete posts" ON public.commentaire FOR DELETE USING (public.admin_check());


--
-- Name: images Enable all access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable all access" ON public.images USING (true);


--
-- Name: commentaire_admin Enable all access for admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable all access for admins" ON public.commentaire_admin USING (public.admin_check());


--
-- Name: link_image_album Enable all access to users who created the album; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable all access to users who created the album" ON public.link_image_album USING ((auth.uid() = id));


--
-- Name: link_video_album Enable all access to users who created the album; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable all access to users who created the album" ON public.link_video_album USING ((auth.uid() = id));


--
-- Name: album Enable delete for albums created by their users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable delete for albums created by their users" ON public.album FOR DELETE USING ((auth.uid() = id_user));


--
-- Name: commentaire Enable delete for users based on id_user; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable delete for users based on id_user" ON public.commentaire FOR DELETE USING ((auth.uid() = id_user));


--
-- Name: album Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.album FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: commentaire Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.commentaire FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: commentaire_admin Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.commentaire_admin FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: commentaire Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.commentaire FOR SELECT USING (true);


--
-- Name: favoris_album Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.favoris_album FOR SELECT USING (true);


--
-- Name: favoris_image Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.favoris_image FOR SELECT USING (true);


--
-- Name: favoris_video Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.favoris_video FOR SELECT USING (true);


--
-- Name: link_image_album Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.link_image_album FOR SELECT USING (true);


--
-- Name: link_video_album Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.link_video_album FOR SELECT USING (true);


--
-- Name: user Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public."user" FOR SELECT USING (true);


--
-- Name: commentaire Enable update for users based on id_user; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for users based on id_user" ON public.commentaire FOR UPDATE USING ((auth.uid() = id_user));


--
-- Name: album Enable update on albums for users who created them; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update on albums for users who created them" ON public.album FOR UPDATE USING ((auth.uid() = id_user));


--
-- Name: favoris_album Enable users all access to their likes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable users all access to their likes" ON public.favoris_album USING ((auth.uid() = id));


--
-- Name: favoris_image Enable users all access to their likes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable users all access to their likes" ON public.favoris_image USING ((auth.uid() = id));


--
-- Name: favoris_video Enable users all access to their likes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable users all access to their likes" ON public.favoris_video;


--
-- Name: album Everyone can see albums; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Everyone can see albums" ON public.album FOR SELECT USING (true);


--
-- Name: user Profiles are viewable by users who created them.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Profiles are viewable by users who created them." ON public."user" FOR SELECT USING ((auth.uid() = id));


--
-- Name: user Users can update their data; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their data" ON public."user" FOR UPDATE USING ((auth.uid() = id));

  
  